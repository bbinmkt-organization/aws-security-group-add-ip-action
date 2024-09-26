import { setFailed } from '@actions/core';

import { publicIpv4 } from 'public-ip';

import { ec2, SecurityGroupId, protocol, port, toPort, description } from './config';
async function run() {
    try {
        const ip = await publicIpv4();
        await ec2.authorizeSecurityGroupIngress({
            GroupId: SecurityGroupId,
            IpPermissions: [
                {
                    IpProtocol: protocol,
                    FromPort: port,
                    ToPort: toPort !== false ? toPort : port,
                    IpRanges: [{ CidrIp: `${ip}/32` }],
                    Description: description
                }
            ]
        }).promise();

        console.log(`IP ${ip} added to security group ${SecurityGroupId}`);
    } catch (error) {
        setFailed(error.message);
    }

}

run();
