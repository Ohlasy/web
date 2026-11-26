Required secrets:

* `AWS_ACCESS_KEY_ID` – the name of the S3-ish bucket that stores infra state
* `AWS_SECRET_ACCESS_KEY` – the secret needed to access the state bucket
* `BUNNYNET_API_KEY` – the API key needed to read and change the infra through Bunny API

Then run `tofu plan` to see needed changes and `tofu apply` to apply them.
After the infra settles run `npm run test` to run tests on the new infra.