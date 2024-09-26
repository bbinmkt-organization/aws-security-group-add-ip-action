import { publicIpv4 } from 'public-ip';
import * as core from '@actions/core';
import * as aws from 'aws-sdk';

async function post() {
    try {
        const ip = await publicIpv4();


        core.info(`Public IP: ${ip}`);

        const awsAccessKeyId = core.getInput('aws-access-key-id');
        const awsSecretAccessKey = core.getInput('aws-secret-access-key');
        const awsRegion = core.getInput('aws-region');

        core.info(`AWS Access Key ID: ${awsAccessKeyId}`);
        core.info(`AWS Secret Access Key: ${awsSecretAccessKey}`);
        core.info(`AWS Region: ${awsRegion}`);

        if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
            core.setFailed('AWS credentials or region not provided');
            return;
        }

        aws.config.update({
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
            region: awsRegion
        });

        const ec2 = new aws.EC2();
        const groupId = core.getInput('aws-security-group-id');
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

        core.info(`IP ${ip} removed from security group ${groupId}`);
    }
    catch (error) {
        //@ts-ignore
        core.setFailed(error.message);
    }
}

post();