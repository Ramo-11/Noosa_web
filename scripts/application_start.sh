#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/Noosa_web/deploy.log

echo 'pm2 restart noosa-web' >> /home/ec2-user/Noosa_web/deploy.log
pm2 restart noosa-web >> /home/ec2-user/Noosa_web/deploy.log