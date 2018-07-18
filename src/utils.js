// Taken from https://stackoverflow.com/a/14438954
export function getUniqueValues (arr) {
  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }
  return arr.filter( onlyUnique )
}

export function findUniqueBandShortNamesInString (string) {
  var regExpressionTester = /(b)\d+/g;
  return getUniqueValues(regExpressionTester.exec(string))
}