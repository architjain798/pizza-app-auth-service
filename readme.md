# NVM

nvm use $(Get-Content .nvmrc)

# To make tsconfig file

./node_modules/.bin/tsc --init
OR
npx tsc --inits

# To run tsc

npx tsc

# prettier

install karo prettier aur usko .prettierignore un sbko ignore krta hai, jo .gitignore mein hote hai

commands
npx prettier . --check
npx prettier . --write
