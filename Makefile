all: server
server:
	bundle exec jekyll serve --future
analytics:
	runhaskell -i_lib _bin/top-articles.hs > _data/nejctenejsi.yml
	git commit _data/nejctenejsi.yml -m "Aktualizace nejčtenějších článků."
