/*
 * Pojoaque Style by Jason Tate
 * http://web-cms-designs.com/ftopict-10-pojoaque-style-for-highlight-js-code-highlighter.html
 * Based on Solarized Style from http://ethanschoonover.com/solarized
 * http://softwaremaniacs.org/media/soft/highlight/test.html
 */

import { css } from '@remirror/react-utils';

export default css`
  code[class*='language-'],
  pre[class*='language-'] {
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    white-space: pre;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
    font-family: Menlo, Monaco, 'Courier New', monospace;
    font-size: 15px;
    line-height: 1.5;
    color: #dccf8f;
    text-shadow: 0;
  }

  pre[class*='language-'],
  :not(pre) > code[class*='language-'] {
    border-radius: 5px;
    border: 1px solid #000;
    color: #dccf8f;
    background: #181914
      url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAMAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQACQYGBgcGCQcHCQ0IBwgNDwsJCQsPEQ4ODw4OERENDg4ODg0RERQUFhQUERoaHBwaGiYmJiYmKysrKysrKysrKwEJCAgJCgkMCgoMDwwODA8TDg4ODhMVDg4PDg4VGhMRERERExoXGhYWFhoXHR0aGh0dJCQjJCQrKysrKysrKysr/8AAEQgAjACMAwEiAAIRAQMRAf/EAF4AAQEBAAAAAAAAAAAAAAAAAAABBwEBAQAAAAAAAAAAAAAAAAAAAAIQAAEDAwIHAQEAAAAAAAAAAADwAREhYaExkUFRcYGxwdHh8REBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyGFEjHaBS2fDDs2zkhKmBKktb7km+ZwwCnXPkLVmCTMItj6AXFxRS465/BTnkAJvkLkJe+7AKKoi2AtRS2zuAWsCb5GOlBN8gKfmuGHZ8MFqIth3ALmFoFwbwKWyAlTAp17uKqBvgBD8sM4fTjhvAhkzhaRkBMKBrfs7jGPIpzy7gFrAqnC0C0gB0EWwBDW2cBVQwm+QtPpa3wBO3sVvszCnLAhkzgL5/RLf13cLQd8/AGlu0Cb5HTx9KuAEieGJEdcehS3eRTp2ATdt3CpIm+QtZwAhROXFeb7swp/ahaM3kBE/jSIUBc/AWrgBN8uNFAl+b7sAXFxFn2YLUU5Ns7gFX8C4ib+hN8gFWXwK3bZglxEJm+gKdciLPsFV/TClsgJUwKJ5FVA7tvIFrfZhVfGJDcsCKaYgAqv6YRbE+RWOWBtu7+AL3yRalXLyKqAIIfk+zARbDgFyEsncYwJvlgFRW+GEWntIi2P0BooyFxcNr8Ep3+ANLbMO+QyhvbiqdgC0kVvgUUiLYgBS2QtPbiVI1/sgOmG9uO+Y8DW+7jS2zAOnj6O2BndwuIAUtkdRN8gFoK3wwXMQyZwHVbClsuNLd4E3yAUR6FVDBR+BafQGt93LVMxJTv8ABts4CVLhcfYWsCb5kC9/BHdU8CLYFY5bMAd+eX9MGthhpbA1vu4B7+RKkaW2Yq4AQtVBBFsAJU/AuIXBhN8gGWnstefhiZyWvLAEnbYS1uzSFP6Jvn4Baxx70JKkQojLib5AVTey1jjgkKJGO0AKWyOm7N7cSpgSpAdPH0Tfd/gp1z5C1ZgKqN9J2wFxcUUuAFLZAm+QC0Fb4YUVRFsAOvj4KW2dwtYE3yAWk/wS/PLMKfmuGHZ8MAXF/Ja32Yi5haAKWz4Ydm2cSpgU693Atb7km+Zwwh+WGcPpxw3gAkzCLY+iYUDW/Z3Adc/gpzyFrAqnALkJe+7DoItgAtRS2zuKqGE3yAx0oJvkdvYrfZmALURbDuL5/RLf13cAuDeBS2RpbtAm+QFVA3wR+3fUtFHoBDJnC0jIXH0HWsgMY8inPLuOkd9chp4z20ALQLSA8cI9jYAIa2zjzjBd8gRafS1vgiUho/kAKcsCGTOGWvoOpkAtB3z8Hm8x2Ff5ADp4+lXAlIvcmwH/2Q==')
      repeat left top;
  }

  pre[class*='language-'] {
    padding: 12px;
    overflow: auto;
  }

  :not(pre) > code[class*='language-'] {
    padding: 2px 6px;
  }

  .token.namespace {
    opacity: 0.7;
  }
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #586e75;
    font-style: italic;
  }
  .token.number,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #468966;
  }

  .token.attr-name {
    color: #b89859;
  }
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #dccf8f;
  }
  .token.selector,
  .token.regex {
    color: #859900;
  }
  .token.atrule,
  .token.keyword {
    color: #cb4b16;
  }

  .token.attr-value {
    color: #468966;
  }
  .token.function,
  .token.variable,
  .token.placeholder {
    color: #b58900;
  }
  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol {
    color: #b89859;
  }
  .token.tag {
    color: #ffb03b;
  }
  .token.important,
  .token.statement,
  .token.deleted {
    color: #dc322f;
  }
  .token.punctuation,
  .token.punctuation.important {
    color: #dccf8f;
  }
  .token.entity {
    cursor: help;
  }
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  /*
.pojoaque-colors {
    color: #586e75;
    color: #b64926;
    color: #468966;
    color: #ffb03b;
    color: #b58900;
    color: #b89859;
    color: #dccf8f;
    color: #d3a60c;
    color: #cb4b16;
    color: #dc322f;
    color: #073642;
    color: #181914;
}
*/
`;
