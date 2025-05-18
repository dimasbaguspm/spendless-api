{ pkgs ? import <nixpkgs> {} }:

with pkgs;
mkShell {
  buildInputs = [
    nodejs_22
    corepack_22
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
    export JWT_SECRET="development_jwt_secret_key_change_in_production"
    export PORT="3000"
    export NODE_ENV="development"
  '';
}
