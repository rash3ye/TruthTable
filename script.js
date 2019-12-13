let alphabet = "ABCDEFGHJIKLMNOPQRSTUVWXYZ";

const context = {};
let processor = {};

const not = arg => {
  return arg.map(e => {
    if (e === "T") return (e = "F");
    else return (e = "T");
  });
};

const and = (arg1, arg2) => {
  return arg1.map((arg, e) => {
    if (arg === "T" && arg === arg2[e]) return (arg = "T");
    else return (arg = "F");
  });
};

const or = (arg1, arg2) => {
  return arg1.map((arg, e) => {
    if (arg === "T" || arg != arg2[e]) return (arg = "T");
    else return (arg = "F");
  });
};

const getStatement = statement => {
  return document.querySelector("#statement").value;
};

const getProps = props => {
  const propsShrink = props
    .replace(" ", "")
    .replace("AND", "")
    .replace("NOT", "")
    .replace("OR", "")
    .replace("(", "")
    .replace(")", "");

  let temp = "";
  for (var i = 0; i < propsShrink.length; i++) {
    if (alphabet.indexOf(propsShrink[i]) !== -1) {
      temp += propsShrink[i];
    }
  }
  return temp.split("");
};

function evaluateStatement() {
  document.querySelector(".output").classList.toggle("close");
  processor = {};
  document.querySelector(".result").innerHTML = "";
  var key = getStatement();
  const keyShrink = getProps(key);

  keyShrink.forEach((key, e) => {
    context[key] = e % 2 === 0 ? ["T", "T", "F", "F"] : ["T", "F", "T", "F"];
  });

  let props = key.split(" ");

  const parser = stream => {
    for (let i = 0; i < stream.length; i++) {
      if (stream[i].substring(0, 3) === "NOT") {
        const theLetter = stream[i].substring(4, 5);
        processor[`NOT(${theLetter})`]
          ? ""
          : (processor[`NOT(${theLetter})`] = not(context[theLetter]));
      } else if (alphabet.indexOf(stream[i]) !== -1) {
        const theLetter = stream[i];
        processor[theLetter] ? "" : (processor[theLetter] = context[stream[i]]);
      }

      if (stream[i] === "AND") {
        if (!processor[stream[i + 1]]) {
          parser([stream[i + 1]]);
        }
        if (processor[stream[i - 1]] && processor[stream[i + 1]]) {
          processor[`${stream[i - 1]} AND ${stream[i + 1]}`]
            ? ""
            : (processor[`${stream[i - 1]} AND ${stream[i + 1]}`] = and(
                processor[stream[i - 1]],
                processor[stream[i + 1]]
              ));
        }
      }

      if (stream[i] === "OR") {
        if (!processor[stream[i + 1]]) {
          parser([stream[i + 1]]);
        }
        if (processor[stream[i - 1]] && processor[stream[i + 1]]) {
          processor[`${stream[i - 1]} OR ${stream[i + 1]}`]
            ? ""
            : (processor[`${stream[i - 1]} OR ${stream[i + 1]}`] = or(
                processor[stream[i - 1]],
                processor[stream[i + 1]]
              ));
        }
      }
    }
  };

  parser(props);

  let headers = "";
  Object.keys(processor).forEach(ttable => {
    headers += `<th>${ttable}</th>`;
  });

  const trow = i => {
    let tdata = "";
    Object.keys(processor).forEach(data => {
      tdata += `<td>${processor[data][i]}</td>`;
    });
    return tdata;
  };

  let tbody = "";

  for (let i = 0; i < 4; i++) {
    tbody += `<tr>${trow(i)}</tr>`;
  }

  const table = `  
<div class="tbl-header">
    <table cellpadding="0" cellspacing="0" border="0">
      <thead>
          <tr>
            ${headers}
        </tr>
      </thead>
    </table>
  </div>
  <div class="tbl-content">
    <table cellpadding="0" cellspacing="0" border="0">
      <tbody>
      ${tbody}
      </tbody>
    </table>
  </div>
  `;
  document.querySelector(".result").innerHTML = table;
}
