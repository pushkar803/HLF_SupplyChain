#!/bin/bash
cd ./fabric
rm -R wallet/*
node enrollAdmin.js
node registerUsers.js
cd ../
node app