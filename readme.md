# NVM

`
nvm use $(Get-Content .nvmrc)
`

# To make tsconfig file

`
./node_modules/.bin/tsc --init
OR
npx tsc --inits
`

# To run tsc
`
npx tsc
`

# prettier

install karo prettier aur usko .prettierignore un sbko ignore krta hai, jo .gitignore mein hote hai commands

`
npx prettier . --check
`

`
npx prettier . --write
`


## git
`
git remote -v
`

`
git remote add template git@github.com:architjain798/mern-node-template.git
`

`
git push template main
`


## command for migration

`
npm run migration:generate -- src/migration/migration -d src/config/data-source.ts
`

`
npm run migration:run -- -d src/config/data-source.ts
`