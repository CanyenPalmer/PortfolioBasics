# Project Overview
Our CEO needs some in-depth research on our CGM patient payments. We're looking to get a clear picture of what's been billed and what's actually come in, especially since we haven't been billing patients yet this year.

Could you please put together an Excel sheet with the following information for each patient on the CGM Sheet?
_________________________
Payment Details Needed Per Patient:
Date of Service (DOS): For each individual service date.
Amount Billed: What was originally billed for that DOS.
Insurance: Which insurance company was billed.
Amount Paid: How much was paid by insurance or the patient for that DOS.
Amount Denied: Any portion of the claim that was denied for that DOS.
Patient Responsibility: The amount the patient owes (if applicable) for that DOS.
__________________________________

Why We Need This:
- This data is crucial for us to understand exactly what has gone out (billed) and what has come in (paid).
- Additionally, our CEO specifically wants to know what each patient technically owes us each month this year, considering we haven't sent out every patient's bill yet.

Thanks so much for your help!


# Methods and Conclusions:

Methods
______________
1) First, I will run an ad-hoc report within Brightree to obtain all of the invoice information needed for this experiment
- Note: not all information is available and not information will be of use, so we will have to manipulate this
2) Recieve ad-hoc results via CSV file and expand information within Excel to view in full table format
- It was observed that there are roughly 15,000 rows and 25 columns of patient invoice information
- These categories hold a multitude of information including: Patient Name, Charge Amount, Allow Amount, and more
3) Since this is a rather large data set, we will create a model in Python that can extract the information needed for this project
- Patient Responsibility is not available as a filter in ad-hoc reports, so we will create this variable and carry it throughout the invoices ourselves in Python
- The initial report summary is very disorganized, we will fix this through Python code as well
- There are a vast amount of different invoices that are not needed for the project, so we will isolate our targeted variables for further manipulation using Python
4) I will make sure to build a model that not only takes an uploaded CSV file and manipulates it to a certain output, but will make sure it is output into a newly created CSV file
- *As instructed to do so per CEO*
5) We will also create a seperate model in the same code file to create another sheet within the newly created CSV file. This other sheet will isolate the patient responsibility month-by-month for each CGM Patient

Conclusions
_______________
- Starting with roughly 15k rows and 25 columns of information, we isolated CGM patients only.
- This resulted in 244 rows and 14 columns of key data for the project.
- I created a function for calculating patient responsibility following basic statistics as follows:

Patient Responsibility = Invoice Allow Amount - Infoice Detail Payments

- I then began to transform into more comprehendable information after the codes completion so that these insights is made transparent to all departments (Technical/Non-Technical teams).
- Next, I created a new model to then organize the patient responsibility over a timeline. This timeline ran month-by-month for each of the company's CGM patients.
- I created 'Totals' for the financial values for quicker analysis of the rows of information on both sheets.
- Finally, I ran the code that would export the manipulated data into a CSV file. I would then work inside this CSV file in Excel using Pivot Tables to make the data more clear.


It was discovered that the company still awaits payment for over 50% ($317,000) of their expected funds in Patient Responsibility assets alone.
Out of all CGM patiens, the company needs 44% ($245,000) of payments to be recieved even after the patient has been billed. 
- This can occur from billing errors, patients not making payments, waiting tranfer balances, and/or more.

That means  currently, the company's sucessful payment ratio is roughly = '56:100'

- 55% of all invoices issued in the US are paid late with 22% of business owners not expecting late payment incidents to cease in the near future
- This can dampen financial stability and can create perminently lost funds overtime (more expenses = more profit lost)


Calculated Totals:
- Patient Responsibility Total = 317k
- *Invoice Detail Charge Total = 602k*
- Invoice Detail Allow Total = 562k
- Invoice Detail Payments = 245k
- *Invoice Detail Balance = 201k*

# Recommendations/Next-Steps:

1) One option would be to continue to expand on more potential insights through accuracy testing, predictive modeling, visualization (charts, graphs, etc.), and/or more
2) Another option would be to analyze the specific invoices that have the highest 'Charge' Amount and the lowest 'Payments' Amount to isolate the "heavy-hitters" first
- This might discover outliers in the data, but this can also be done through statistical methods like regression analysis and hypothesis testing
3) Identify what patients have a recurring 'Patient Responsibility' amount over a long period time and compare this to patients both similar and opposite of these characteristics
- This might identify the patients who create what acts as a flat-rate in owed expenses throughout their payment history with the company
