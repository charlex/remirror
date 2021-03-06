# @microsoft/api-documenter

This tool can be used to generate an online API reference manual for your TypeScript library.
It reads the \*.api.json data files produced by [API Extractor](https://api-extractor.com/),
and then generates web pages using the [Markdown](https://en.wikipedia.org/wiki/Markdown)
file format.

The **api-documenter** tool is part of Microsoft's production documentation pipeline.
It is provided as a code sample to illustrate how to load and process the
API JSON file format. If your requirements are simple, you can use this tool directly.
For more advanced scenarios, developers are encouraged to fork the project and modify
the source code. This is possible because most of processing is already performed upstream
by API Extractor.

For more information, see the
[Generating Docs](https://api-extractor.com/pages/setup/generating_docs/) article from the API Extractor documentation.
