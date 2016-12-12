all: server
server:
	bundle exec jekyll serve --future
analytics:
	cabal exec runghc -- -i_lib _bin/top-articles.hs > _data/nejctenejsi.yml
	git commit _data/nejctenejsi.yml -m "Aktualizace nejčtenějších článků"
quickcheck:
	htmlproofer --disable-external --alt-ignore '/profiles/' --file-ignore '/node_modules/' _site/
check:
	htmlproofer --alt-ignore '/profiles/' --file-ignore '/node_modules/' _site/
