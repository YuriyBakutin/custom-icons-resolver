#!/bin/bash

startTime=$(date +%s)

npm i

#cd examples/vue3
cd tests/casesBuilding

folderlist=()
while IFS= read -d $'\0'; do
  folderlist+=("${REPLY:2}")
done < <(find . -mindepth 1 -maxdepth 1 -type d -print0)

for item in ${folderlist[*]}; do
  printf "\nnpm install in %s\n" $item
  cd $item
  rm -rf node_modules
  npm i
  printf "\nnpm run build in %s" $item
  rm -rf dist
  startBuilding=$(date +%s)
  npm run build
  endBuilding=$(date +%s)
  buildingTime=$(($endBuilding - $startBuilding))
  echo "Building in $item completed in $buildingTime s"
  cd ../
done

preparationEndTime=$(date +%s)
preparationTime=$(($preparationEndTime - $startTime))
echo ""
echo "Total preparation time $preparationTime s"

cd ../../

startLintingTime=$(date +%s)

echo ""
echo "Linting start"

./node_modules/eslint/bin/eslint.js --fix --ignore-path .gitignore .

endLintingTime=$(date +%s)
lintingTime=$(($endLintingTime - $startLintingTime))
echo "Linting time $lintingTime s"

./node_modules/jest/bin/jest.js

totalEndTime=$(date +%s)
totalTime=$(($totalEndTime - $startTime))
echo ""
echo "Total execute time $totalTime s"
