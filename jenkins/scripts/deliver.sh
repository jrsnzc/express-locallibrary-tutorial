#!/usr/bin/env sh

set -x
npm run serverstart &
sleep 1
echo $! > .pidfile
set +x

echo 'Now...'
echo 'Visit http://localhost:3000 to see your application in action.'
echo '(This is why you specified the "args ''-p 3000:3000''" parameter when you'
echo 'created your initial Pipeline as a Jenkinsfile.)'
