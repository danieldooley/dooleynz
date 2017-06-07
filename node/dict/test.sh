#!/bin/bash
echo '['
while read TEST
do
RES=`curl https://wordsapiv1.p.mashape.com/words/$TEST/definitions -H 'X-Mashape-Key: 8ZMaGLi2JFmshYgp4xO9wHSOq9JFp1DyBwUjsnTV7ECbjRpfTW'`
echo $RES
echo ','
done
echo ']'