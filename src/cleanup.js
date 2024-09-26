const { ec2, SecurityGroupId, protocol, port, toPort } = require('./config');
const { publicIpv4 } = require('public-ip');
const { setFailed } = require('@actions/core');

async function cleanup() {
    try {
        const ip = await publicIpv4();
        await ec2.revokeSecurityGroupIngress({
            GroupId: SecurityGroupId,
            IpPermissions: [{
                IpProtocol: protocol,
                FromPort: port,
                ToPort: toPort !== false ? toPort : port,
                IpRanges: [{ CidrIp: `${ip}/32` }],
            }]
        }).promise();
        console.log(`IP ${ip} removed from security group ${SecurityGroupId}`);
    }
    catch (error) {
        console.error(error);
        setFailed(error.message);
    }
}

cleanup();