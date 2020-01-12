// staffpms.json
/* // Sample data:
"01032158": {
    "eid": "01032158",
    "fname": "Phannee",
    "lname": "Changhin",
    "function": "RR_Sales",
    "shopCode": 80000423,
    "shopName": "Central Festival Chiangmai",
    "region": "UPC UNORTH",
    "district": "UPC",
    "shopGroup": "True Shop",
    "pmsYTD": 46.99,
    "pmsScore": {
      "1810": 35.72,
      "1811": 34.11,
      "1812": 29.4,
      "1901": 46.4,
      "1902": 54.52,
      "1903": 72.53,
      "1904": 48.68,
      "1905": 54.55
    },
    "rankShop": 7,
    "rankRegion": 62,
    "rankDistrict": 670,
    "rankNationwide": 1042
  },
  */

// PREPARATION:
// 1. Use template-staffpms.xlsx and clean previous data
// 2. Copy column 'emp_id8' to 'sname_eng' of manpower file (people team) to 'Manpower' sheet in template
// 3. Copy all columns from pms file (commission team) to 'Workspace' sheet in template
// 4. Change column names to match the structure (already in template)
// 5. Copy column 'eid' to 'id' in first column
// 6. Create 2 columns: D, E for 'fname' and 'lname' and vlookup English names from 'Manpower' sheet >> =IFERROR(VLOOKUP($B2,Manpower!$A:$E,4,0),$C2) , =IFERROR(VLOOKUP($B2,Manpower!$A:$E,5,0),$C2)
// 7. Create 1 column to the right of Employee/district called 'district' and reformat district with >> =IFERROR(LEFT(RIGHT($J2, LEN($J2)-7),3),"")
// 8. Create 1 column to the rightmost called 'pmsScore' and reformat monthly score with >>
/*
="{"&
IF(M3<>"",""""&$M$1&""" : "&M3&", ","")&
IF(N3<>"",""""&$N$1&""" : "&N3&", ","")&
IF(O3<>"",""""&$O$1&""" : "&O3&", ","")&
IF(P3<>"",""""&$P$1&""" : "&P3&", ","")&
IF(Q3<>"",""""&$Q$1&""" : "&Q3&", ","")&
IF(R3<>"",""""&$R$1&""" : "&R3&", ","")&
IF(S3<>"",""""&$S$1&""" : "&S3&", ","")&
IF(T3<>"",""""&$T$1&""" : "&T3&", ","")&
IF(U3<>"",""""&$U$1&""" : "&U3,"")&"}"
*/
// and keep adding more months to the formula each time
// 9. Create 4 columns to the rightmost called 'rankShop', 'rankRegion', 'rankDistrict', 'rankNationwide'
// use these formula >>
// rankShop >> =SUMPRODUCT(($F:$F=$F2)*($G:$G=$G2)*($V2<$V:$V))+1
// rankRegion >> =SUMPRODUCT(($F:$F=$F2)*($I:$I=$I2)*($V2<$V:$V))+1
// rankDistrict >> =SUMPRODUCT(($F:$F=$F2)*($K:$K=$K2)*($V2<$V:$V))+1
// rankNationwide >> =SUMPRODUCT(($F:$F=$F2)*($V2<$V:$V))+1
// 9.2 Delete rows with Com7 AM (function = AM, ID starts with 39)
// 9.3 Replace ASST_Sales AND ASST_Services WITH Assist
// 9.4 Replace  RR_Sales_New WITH RR_Sales
// 9.5 Replace ITF_Multi WITH RR_ITF
// 10. Copy values & formats from the whole table to 'StaffPMS' sheet. Remove unused columns.
// 11. Export to text file (tab delimited text)
// 12. Use https://www.csvjson.com/csv2json to convert .txt to .json (Has mode)
// 13. Clean up data by replacing text in .json file
// from \" to "
// from "{ to {
// from , }" to }

// ############################################################################################################################

// users.json
/* // Sample data:
  "01084631": {
    "eid": "01084631",
    "fname": "affan",
    "lname": "budiah",
    "shopCode": 80000614
  },
  */

// PREPARATION:
// 1. Copy row: 'id, 'eid', 'fname', 'lname', 'shopCode' from StaffPMS sheet to 'Users' sheet
// 2. Export to text, convert to json

// ############################################################################################################################

// kpiradar.json
/* // Sample data:
"010D3106": {
    "eid": "010D3106",
    "function": "RR_Services",
    "shopCode": 80000056,
    "region": "UPC LNORTH",
    "district": "UPC",
    "Sales": 200,
    "Retention": 62.44,
    "Digital Platform": 0,
    "Knowledge": 25,
    "iCSAT": 55.33
  },
  */

// PREPARATION:
// 1. Copy row: 'id', 'eid', 'function', 'shopCode', 'region', 'district'  from StaffPMS sheet to 'RadarWorkspace' sheet
// 2. Use vlookup template in execution file to get all data. Copy data to 'RadarData190X' sheet
// 3. Change vlookup formula in 'RadarWorkspace' sheet to match the last 3 months
// 4. Copy values & formats from the whole table to 'KPIRadar' sheet. Remove unused columns.
// 5. Export to txt and json

// ############################################################################################################################

// UPDATE PROGRAM MONTHLY
// 1. Replace 'staffpms.json', 'users.json', 'kpiradar.json' to new month
// 2. Change month num in the constructor this.state = xxx code in App.js
/*
appSettings: {
        monthStart: "Oct18",
        monthAsOf: "",
        monthAsOfNum: 1905,
        ...
*/
