# Logistic-Regression-and-Tree-based-Machine-Learning

## HR Department at Salifort Motors
Goal: Construct a prediction model that accurately predicts whether an employee will leave the company or not

Initial observations is that focusing our attention to the categories work_accident, left, and/or promotion_last_5years would have the most affect on the employees desire to leave the company.

We will focus on the data in Kaggle for our observations. The data set contains 15,000 rows and 10 columns

I would consider having the employees who have already refuse to continue work with the company provide any detail as to why they feel that way. All additional remarks both factual or opinionated may contribute to discovering a correlating issue.


### Summary of model results
Logistic Regression

The logistic regression model achieved precision of 80%, recall of 83%, f1-score of 80% (all weighted averages), and accuracy of 83%, on the test set.

Tree-based Machine Learning

After conducting feature engineering, the decision tree model achieved AUC of 93.8%, precision of 87.0%, recall of 90.4%, f1-score of 88.7%, and accuracy of 96.2%, on the test set. The random forest modestly outperformed the decision tree model.

### Conclusion, Recommendations, Next Steps¶
The models and the feature importances extracted from the models confirm that employees at the company are overworked.

To retain employees, the following recommendations could be presented to the stakeholders:

1) Cap the number of projects that employees can work on.

2) Consider increasing the promoting system for employees who have worked for 4 years or longer, and conduct further investigation about why four-year tenured employees are so dissatisfied.

3) Either reward employees for working longer hours (financially, grant more personalized request like a shift change, etc), or don't require them to do so.

4) Repeat the company's overtime pay policies to all employees both satisfied and unsatisfied. If the expectations around workload and time off aren't explicit, make them clear.

5) Hold company-wide and within-team discussions to understand and address the company work culture, across the board and in specific contexts.

6) High evaluation scores should not be reserved for employees who work 200+ hours per month. Consider a proportionate scale for rewarding employees who contribute more/put in more effort. Promotion of these employees might even be worth consideration if their duration and loyalty to the company reflect it.

Next Steps

It may be justified to still have some concern about data leakage. It is worth considering how predictions change when last_evaluation is removed from the data. If evaluations aren't performed very frequently, it would be useful to be able to predict employee retention without this feature. It is possible that the evaluation score determines whether an employee leaves or stays, in which case it could be useful to pivot and try to predict performance score. The same could be said for satisfaction score. To Determine this, more investigation would need to be made.

For another project, you could try building a K-means model on this data and analyzing the clusters to discover additional insights.
