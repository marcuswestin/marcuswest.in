all:
	node scripts/compile.js

run:
	node scripts/runDev.js

# Utils
#######
push: index
	git push origin master
	curl http://marcuswest.in/pull/index.php

update-store.js:
	curl https://raw.github.com/marcuswestin/store.js/master/store.js > lib/store.js

lib/less:
	git clone https://github.com/cloudhead/less.js.git lib/less
	cd lib/less; git checkout a2807288008587b95c6c #(dist) build 1.0.36
