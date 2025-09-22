# CGM-Patient-Analytics

![GitHub last commit](https://img.shields.io/github/last-commit/CanyenPalmer/CGM-Patient-Analytics)
![GitHub repo size](https://img.shields.io/github/repo-size/CanyenPalmer/CGM-Patient-Analytics)
![Top language](https://img.shields.io/github/languages/top/CanyenPalmer/CGM-Patient-Analytics)
![Language count](https://img.shields.io/github/languages/count/CanyenPalmer/CGM-Patient-Analytics)

---

## Project Overview

Our CEO needs some in-depth research on CGM patient payments to understand what has been billed versus what has actually been received, especially since billing for patients has not yet occurred this year.  

For each patient, the following details were required per Date of Service (DOS):  
- **Amount Billed**  
- **Insurance** billed  
- **Amount Paid** by insurance or patient  
- **Amount Denied**  
- **Patient Responsibility** (calculated if not directly reported)  

This data is essential to identify what has gone out (billed), what has come in (paid), and what each patient technically owes per month.

---

## Methods

1. Ran an ad-hoc Brightree report to obtain invoice data.  
   - ~15,000 rows × 25 columns initially.  
2. Processed CSV output in Excel for initial inspection.  
3. Built a Python model to:  
   - Isolate CGM patient invoices.  
   - Create a calculated **Patient Responsibility** variable.  
   - Clean disorganized invoice data into usable format.  
   - Output results into a new CSV file.  
4. Created a secondary model to:  
   - Aggregate patient responsibility **month-by-month**.  
   - Include **totals** for easier financial analysis.  
5. Used Excel Pivot Tables on the output for further exploration.  

---

## Conclusions

- Reduced from ~15k rows to **244 rows × 14 columns** of key CGM patient data.  
- Patient Responsibility was defined as:  
- Company still awaits **>50% ($317k)** of expected funds in patient responsibility.  
- **44% ($245k)** of billed patient payments remain outstanding.  
- Current successful payment ratio ≈ **56:100**.  
- Industry context: ~55% of invoices are paid late; 22% of businesses expect late payments to persist.  

`Patient Responsibility = [Invoice Allow Amount - Invoice Detail Payments]`

### Calculated Totals
- **Patient Responsibility Total:** $317k  
- **Invoice Detail Charge Total:** $602k  
- **Invoice Detail Allow Total:** $562k  
- **Invoice Detail Payments:** $245k  
- **Invoice Detail Balance:** $201k  

---

## Recommendations / Next Steps

1. Expand analysis with **predictive modeling, accuracy testing, and visualizations** (charts, graphs, dashboards).  
2. Prioritize invoices with **highest charges** but **lowest payments** to reduce largest risks first.  
3. Identify patients with recurring patient responsibility over time to detect flat-rate expense contributors.  
4. Explore regression or clustering methods to uncover additional payment trends and risk groups.  
