yarn unlink @kikonen/$1 && \
  yarn add --force @kikonen/$1 && \
  rake vendor:all && \
  rm -fr tmp/cache
