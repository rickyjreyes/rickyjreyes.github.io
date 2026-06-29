FROM ubuntu:noble-20260509.1

ARG DEBIAN_FRONTEND=noninteractive
ARG ELAN_COMMIT=6737edca3d2ca3dbaa1b47b87769b48b420633ae
ARG LEAN_TOOLCHAIN=leanprover/lean4:v4.23.0

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       ca-certificates curl git make gcc g++ python3 python3-pip python3-venv unzip \
    && rm -rf /var/lib/apt/lists/*

ENV ELAN_HOME=/opt/elan
ENV PATH=/opt/elan/bin:/opt/wct-venv/bin:${PATH}
ENV PYTHONHASHSEED=0
ENV SOURCE_DATE_EPOCH=1782691200
ENV TZ=UTC
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

RUN curl --fail --location --silent --show-error \
      "https://raw.githubusercontent.com/leanprover/elan/${ELAN_COMMIT}/elan-init.sh" \
      --output /tmp/elan-init.sh \
    && sh /tmp/elan-init.sh -y --no-modify-path --default-toolchain "${LEAN_TOOLCHAIN}" \
    && rm /tmp/elan-init.sh \
    && lean --version \
    && lake --version

WORKDIR /workspace
COPY release/WCT-2026.2/requirements.lock /tmp/wct-requirements.lock
RUN python3 -m venv /opt/wct-venv \
    && python -m pip install --disable-pip-version-check --requirement /tmp/wct-requirements.lock

COPY . /workspace
CMD ["make", "reproduce", "REPRO_FLAGS=--skip-install"]
