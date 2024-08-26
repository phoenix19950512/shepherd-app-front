# Shepherd App (Front-end)

This is the front-end app for ShepherdTutors, written in React and bootstrapped with `create-react-app`.

## Launching project locally

1. Pull the repository to your local environment by running `git pull https://github.com/shepherdtutors/shepherd-app.git` in your terminal.
2. Run `npm install` to install the project's dependencies.
3. Run `npm run prepare` to set up husky, which we use for pre-commits.
4. Run `npm run start` to launch the project on `localhost:3000`.
   PRO-TIP: Favor `npm` over `yarn`. Funny things can happen when your package-lock.json clashes with this project's yarn.lock.

## Additional helpful scripts

1. `npm run lint` — to run eslint on your code
2. `npm run lint-and-fix` to detect and fix linting errors.
3. `npm run build` to create an optimized production build of the React code.
4. `npm run prettier-format` for prettier formatting. Applies global prettier fixes to the codebase.
5. `npm run analyze` to analyze your build.

## Branch naming

1. The `main` branch serves the production code.
2. The `dev` branch serves the dev code.
3. We have no strict requirements about how you should name your own branches, though something like `{type}/{scope}` is nice (an example would be `feature/pdf-viewer` that tells us you're creating the pdf-viewer feature on that branch.)

## Contributing

1. Ensure your pre-commits return `everything is awesome`.
2. Ensure your code passes the Netlify deploy pipeline (all green checkmarks, no red x'es).
3. Have at least one other project contributor review your code before merging with either the `dev` or `main` branch.
4. Do not use the force. Do not force-push. If you have a nasty git resolution problem, shoot an SOS message in the Slack channel, and one of your colleagues will be around to assist!

Happy coding, and LGTM!
