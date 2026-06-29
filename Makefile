PYTHON ?= python3
RELEASE_ID ?= WCT-2026.2
REPRO_SCRIPT := release/$(RELEASE_ID)/reproduce.py
REQUIREMENTS := release/$(RELEASE_ID)/requirements.lock
BOOTSTRAP_DIR := .reproduction/$(RELEASE_ID)-bootstrap
BOOTSTRAP_PYTHON := $(BOOTSTRAP_DIR)/bin/python
REPRO_FLAGS ?=
DOCKER_IMAGE ?= wct-release:$(RELEASE_ID)

.PHONY: reproduce docker-build docker-reproduce nix-reproduce verify-manifest clean-reproduction

verify-manifest:
	$(PYTHON) -m json.tool release/$(RELEASE_ID)/release-manifest.json >/dev/null
	$(PYTHON) -m py_compile $(REPRO_SCRIPT)

reproduce: verify-manifest
	rm -rf $(BOOTSTRAP_DIR)
	$(PYTHON) -m venv $(BOOTSTRAP_DIR)
	$(BOOTSTRAP_PYTHON) -m pip install --disable-pip-version-check --requirement $(REQUIREMENTS)
	$(BOOTSTRAP_PYTHON) $(REPRO_SCRIPT) --skip-install $(REPRO_FLAGS)

docker-build:
	docker build --file release/$(RELEASE_ID)/Dockerfile --tag $(DOCKER_IMAGE) .

docker-reproduce:
	mkdir -p release-output/$(RELEASE_ID)
	docker run --rm \
		--volume "$(CURDIR)/release-output:/workspace/release-output" \
		$(DOCKER_IMAGE)

nix-reproduce:
	nix develop --command make reproduce REPRO_FLAGS="$(REPRO_FLAGS)"

clean-reproduction:
	rm -rf .reproduction release-output/$(RELEASE_ID)
