# Deploy Docs

Build and deploys mkdocs documentation site on github commit. Source repository is [JournalDocs](https://github.com/ajaxe/JournalDocs).

This function is deployed at https://faas.apogee-dev.com/function/deploy-docs. The webhook is secured with a shared secret.

Custom openfaas [template](https://github.com/ajaxe/openfaas-functions/tree/master/template/node-mkdocs) is used to create docker image with nodejs and python (for mkdocs).
