PATH="`pwd`/node_modules/.bin:$PATH"
if [ $# -ne 1 ]
then
    echo "$0 {demo-directory}"
    exit 1
fi
tsc --module commonjs --noEmitOnError --noImplicitAny --suppressImplicitAnyIndexErrors --target ES6 --jsx preserve \
    `ls ./$1/*.ts*` typings/main.d.ts || exit 1
webpack --entry "./$1/index.jsx" --output-filename "./$1/all.js" || exit 1
