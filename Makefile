JADE = ./node_modules/.bin/jade
SASS = ./node_modules/.bin/node-sass

HTML = 404.html \
	index.html

CSS = stylesheets/style.css

%.html: %.jade
	$(JADE) --path $< < $< > $@

%.css: %.scss
	$(SASS) --output-style=compressed $< $@

all: docs styles

docs: $(HTML)

styles: $(CSS)

clean:
	rm -f *.html
	rm -f stylesheets/*.css

.PHONY: all docs styles clean
