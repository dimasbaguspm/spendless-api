{ pkgs ? import <nixpkgs> {} }:

with pkgs;
mkShell {
  buildInputs = [
    nodejs_22
    yarn
    postgresql_16
    git
  ];

  shellHook = ''
    echo "SpendLess API development environment"
    echo "Node.js $(node --version)"
    echo "PostgreSQL $(psql --version)"
    
    export PGDATA="$PWD/.direnv/postgres"
    export PGHOST="$PGDATA"
    export PGUSER="postgres"
    export PGDATABASE="spendless"
    export PGPORT="5432"
    export DATABASE_URL="postgresql://$PGUSER@localhost:$PGPORT/$PGDATABASE"
  '';
}
