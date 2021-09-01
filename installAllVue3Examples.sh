#!/bin/bash

totalStart=$(date +%s)

cd examples/vue3

folderlist=()
while IFS=  read -d $'\0'; do
  folderlist+=("${REPLY:2}")
done < <(find . -mindepth 1 -maxdepth 1 -type d -print0)

for item in ${folderlist[*]}
do
  printf "\nnpm install in %s\n" $item
  cd $item
  npm i
  cd ../
done

totalEnd=$(date +%s)
totalTime=$(($totalEnd - $totalStart))
echo ""
echo "Total execution time $totalTime s"
