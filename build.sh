#!/usr/bin/env dsh

#=docker:stable

docker build --tag mountainpass/steam-friends:latest .

echo To run: docker run -it --rm -p 3000:80 mountainpass/steam-friends:latest

