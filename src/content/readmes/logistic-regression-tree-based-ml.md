# Logistic-Regression-and-Tree-based-Machine-Learning

![GitHub last commit](https://img.shields.io/github/last-commit/CanyenPalmer/Logistic-Regression-and-Tree-based-Machine-Learning)
![GitHub repo size](https://img.shields.io/github/repo-size/CanyenPalmer/Logistic-Regression-and-Tree-based-Machine-Learning)
![Top language](https://img.shields.io/github/languages/top/CanyenPalmer/Logistic-Regression-and-Tree-based-Machine-Learning)
![Language count](https://img.shields.io/github/languages/count/CanyenPalmer/Logistic-Regression-and-Tree-based-Machine-Learning)

## HR Department at Salifort Motors

**Goal:** Construct a prediction model that accurately predicts whether an employee will leave the company or not.  

Initial observations suggest that focusing attention on the categories **work_accident**, **left**, and/or **promotion_last_5years** would most affect an employee’s decision to leave the company.

We will focus on the Kaggle dataset for our observations. The dataset contains **15,000 rows** and **10 columns**.  

I would also consider asking employees who have already left to provide detail as to why they felt that way. Both factual and opinion-based feedback may contribute to discovering correlating issues.

---

### Summary of Model Results

**Logistic Regression**  
- Precision: 80%  
- Recall: 83%  
- F1-score: 80% (weighted average)  
- Accuracy: 83%  

**Tree-based Machine Learning**  
- After feature engineering, the **decision tree model** achieved:  
  - AUC: 93.8%  
  - Precision: 87.0%  
  - Recall: 90.4%  
  - F1-score: 88.7%  
  - Accuracy: 96.2%  
- The **random forest** modestly outperformed the decision tree model.  

---

### Conclusion, Recommendations, Next Steps

The models and extracted feature importances confirm that employees at the company are **overworked**.  
To retain employees, the following recommendations could be presented to stakeholders:  

1. Cap the number of projects that employees can work on.  
2. Increase promotion opportunities for employees with ≥4 years tenure. Investigate dissatisfaction among four-year employees.  
3. Either reward employees for working longer hours (financially, flexible shifts, etc.) or reduce the requirement.  
4. Reiterate the company’s overtime pay policies and make workload expectations explicit.  
5. Hold company-wide and team-level discussions to understand and improve work culture.  
6. Reconsider evaluation systems that reserve high scores for extreme hours. Implement proportional recognition and consider promotions for loyal contributors.  

---

### Next Steps

- Investigate potential **data leakage**: examine how predictions change when `last_evaluation` is removed.  
- If evaluations aren’t frequent, it may be valuable to predict retention without this feature.  
- Consider pivoting to predict **performance score** or **satisfaction score**, since these may determine retention.  
- For further exploration, try a **K-means clustering model** on this dataset to uncover additional insights.  

