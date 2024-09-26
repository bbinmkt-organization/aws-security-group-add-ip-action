import { publicIpv4 } from 'public-ip';
import * as core from '@actions/core';
import * as aws from 'aws-sdk';

async function post() {
    try {
        const ip = await publicIpv4();


        aws.config.update({
            accessKeyId: core.getInput('aws-access-key-id'),
            secretAccessKey: core.getInput('aws-secret-access-key'),
            region: core.getInput('aws-region')
        });

        const ec2 = new aws.EC2();
        const groupId = core.getInput('security-group-id');
        const protocol = core.getInput('protocol');
        const port = core.getInput('port');
        const toPort = core.getInput('to-port');

        await ec2.revokeSecurityGroupIngress({
            //@ts-ignore
            GroupId: groupId,
            IpPermissions: [{
                IpProtocol: protocol,
                FromPort: port,
                ToPort: toPort ? toPort : port,
                IpRanges: [{ CidrIp: `${ip}/32` }],
            }]
        }).promise();
        console.log(`IP ${ip} removed from security group ${groupId}`);
    }
    catch (error) {
        //@ts-ignore
        core.setFailed(error.message);
    }
}

post();