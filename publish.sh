#!/usr/bin/env dsh -E

[[ -z "$DOCKER_ID_USER" ]] && { echo "DOCKER_ID_USER must be set to your Docker ID username." ; exit 1; }
[[ -z "$DOCKER_ID_PASS" ]] && { echo "DOCKER_ID_PASS must be set to your Docker ID password." ; exit 1; }

export BASE_IMAGE=mountainpass/steam-friends
export DSTAMP=`date '+%Y-%m-%d'`

#=docker:stable

echo "$DOCKER_ID_PASS" | docker login --username "$DOCKER_ID_USER" --password-stdin

# push chrome

docker tag ${BASE_IMAGE}:latest ${BASE_IMAGE}:${DSTAMP}
docker push ${BASE_IMAGE}:${DSTAMP}
docker push ${BASE_IMAGE}:latest
