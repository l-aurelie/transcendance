#!/bin/bash
#Laura file

echo -e "\e[1;35m Helper mission is ago... \e[0m"
#download missing dependencies
cd ./nest
[ ! -d "./node_modules/" ] && echo -e "\e[1;32m downloading nest dependencies \e[0m" && npm install --legacy-peer-deps
cd ..
cd ./react
[ ! -d "./node_modules/" ] && echo -e "\e[1;32m downloading react dependencies \e[0m" && npm install --legacy-peer-deps
cd ..


#delete old paths in .env
echo -e "\e[1;36m setting volume path variables \e[0m"
sed -i '20d' .env
sed -i '20d' .env
#replace with correct path in .env
echo "NEST_PATH=${PWD}/nest/node_modules" >> .env
echo "REACT_PATH=${PWD}/react/node_modules" >> .env
echo -e "\e[1;35m Helper mission is complete :) \e[0m"
