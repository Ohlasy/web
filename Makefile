all: server
server:
	bundle exec jekyll serve --future
quickcheck:
	htmlproofer --disable-external --alt-ignore '/profiles/' --file-ignore '/node_modules/' _site/
check:
	htmlproofer --alt-ignore '/profiles/' --file-ignore '/node_modules/' _site/
