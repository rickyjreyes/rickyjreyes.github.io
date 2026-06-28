{
  description = "Frozen WCT-2026.1 reproduction environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/ac62194c3917d5f474c1a844b6fd6da2db95077d";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in {
      devShells = forAllSystems (system:
        let pkgs = import nixpkgs { inherit system; };
        in {
          default = pkgs.mkShell {
            packages = with pkgs; [
              python312
              git
              gnumake
              curl
              cacert
              elan
              gcc
              unzip
            ];
            PYTHONHASHSEED = "0";
            SOURCE_DATE_EPOCH = "1782604800";
            TZ = "UTC";
            LC_ALL = "C.UTF-8";
            LANG = "C.UTF-8";
            shellHook = ''
              export ELAN_HOME="$PWD/.reproduction/elan"
              export PATH="$ELAN_HOME/bin:$PATH"
              mkdir -p "$ELAN_HOME"
              elan toolchain install leanprover/lean4:v4.23.0 >/dev/null 2>&1 || true
              elan default leanprover/lean4:v4.23.0 >/dev/null 2>&1 || true
            '';
          };
        });
    };
}
