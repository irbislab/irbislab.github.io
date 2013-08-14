JADE = ./node_modules/.bin/jade

HTML = 404.html

docs: $(HTML)

%.html: %.jade
	$(JADE) < $< > $@

clean:
	rm -f *.html

.PHONY: docs clean
