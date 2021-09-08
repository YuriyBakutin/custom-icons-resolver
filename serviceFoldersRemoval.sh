#!/bin/bash

startTime=$(date +%s)

rm -rf node_modules

cd tests/casesBuilding

folderlist=()
while IFS= read -d $'\0'; do
  folderlist+=("${REPLY:2}")
done < <(find . -mindepth 1 -maxdepth 1 -type d -print0)

for item in ${folderlist[*]}; do
  printf "\nnpm clear in %s\n" $item
  cd $item
  rm -rf node_modules
  rm -rf dist
  cd ../
done

clearingEndTime=$(date +%s)
clearingTime=$(($clearingEndTime - $startTime))
echo ""
echo "Total clearing time $clearingTime s"
