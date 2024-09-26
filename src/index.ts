import * as core from '@actions/core';
import * as aws from 'aws-sdk';

import { publicIpv4 } from 'public-ip';

async function add() {
    const ip = await publicIpv4();

    core.info(`Public IP: ${ip}`);
    const ec2 = new aws.EC2();

    aws.config.update({
        accessKeyId: core.getInput('aws-access-key-id'),
        secretAccessKey: core.getInput('aws-secret-access-key'),
        region: core.getInput('aws-region')
    });

    const GroupId = core.getInput('aws-security-group-id');



    core.info(`Security Group ID: ${GroupId}`);

    const port = core.getInput('port');

    core.info(`Port: ${port}`);

    const toPort = core.getInput('to-port');

    core.info(`To Port: ${toPort}`);

    const protocol = core.getInput('protocol');

    core.info(`Protocol: ${protocol}`);

    const description = core.getInput('description');

    core.info(`Description: ${description}`);

    const params = {
        GroupId,
        IpPermissions: [
            {
                IpProtocol: protocol,
                FromPort: port,
                ToPort: toPort ? toPort : port,
                IpRanges: [{ CidrIp: `${ip}/32` }],
                Description: description
            }
        ]
    };

    try {
        // @ts-ignore
        const data = await ec2.authorizeSecurityGroupIngress(params).promise();

        core.info(`IP ${ip} added to security group ${GroupId}`);
        // @ts-ignore
        core.info(data);
    } catch (error) {
        // @ts-ignore
        core.setFailed(error.message);
    }


}

add();
