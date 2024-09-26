const { setFailed } = require('@actions/core');
const { publicIpv4 } = require('public-ip');
const { ec2, SecurityGroupId, protocol, port, toPort, description } = require('./config');

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