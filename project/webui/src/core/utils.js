import isInteger from "lodash/isInteger";

export function toCapitalCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function getJobCloneDetails(jobDetails) {
  let output = jobDetails.output.split('/').slice(0, -1).join('/');
  let name = jobDetails.name.split(' ');
  let number = +name.slice(-1)[0];

  name = isInteger(number) ? 
    `${name.slice(0, -1).join(' ')} ${++number}` :
    `${name} 2`;

  return {
    ...jobDetails,
    name,
    output,
  };
}