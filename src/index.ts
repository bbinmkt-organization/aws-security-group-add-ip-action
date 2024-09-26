import * as core from '@actions/core';
import * as aws from 'aws-sdk';

import { publicIpv4 } from 'public-ip';

async function add() {
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

    const GroupId = core.getInput('aws-security-group-id')
    const port = core.getInput('port');
    const toPort = core.getInput('to-port');
    const protocol = core.getInput('protocol');
    const description = core.getInput('description');


    core.info(`Security Group ID: ${GroupId}`);
    core.info(`Port: ${port}`);
    core.info(`To Port: ${toPort}`);
    core.info(`Protocol: ${protocol}`);
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
