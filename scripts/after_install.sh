#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/Noosa_web/deploy.log

echo 'cd /home/ec2-user/Noosa_web' >> /home/ec2-user/Noosa_web/deploy.log
cd /home/ec2-user/Noosa_web >> /home/ec2-user/Noosa_web/deploy.log

echo 'npm install' >> /home/ec2-user/Noosa_web/deploy.log 
npm install >> /home/ec2-user/Noosa_web/deploy.log