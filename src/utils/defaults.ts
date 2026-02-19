import type { GlobalSettings, Space, LabReport, AbstractData, WorkProgressData, ConclusionData, AppendixData } from '../types/report';

export const defaultGlobalSettings: GlobalSettings = {
  faculty: 'Факультет електроніки та комп\'ютерних технологій',
  studentName: '',
  studentGroup: '',
};

export const defaultAbstract: AbstractData = { content: '' };

export const defaultWorkProgress: WorkProgressData = {
  items: [{ id: '1', text: '' }],
};

export const defaultConclusion: ConclusionData = { content: '' };

export const defaultAppendix: AppendixData = { title: 'Код програми', code: '' };

export function createDefaultReport(labNumber = '1'): LabReport {
  return {
    id: Date.now().toString(),
    labNumber,
    topic: '',
    enabledBlocks: ['abstract', 'workProgress', 'conclusion'],
    abstract: { ...defaultAbstract },
    workProgress: { items: [{ id: Date.now().toString(), text: '' }] },
    conclusion: { ...defaultConclusion },
    appendix: { ...defaultAppendix },
  };
}

export function createDefaultSpace(courseName: string, teacherTitle: string, teacherName: string): Space {
  return {
    id: Date.now().toString(),
    courseName,
    teacherTitle,
    teacherName,
    reports: [],
  };
}

/** Pre-populated demo space for first-launch testing. */
export function createDemoSpace(): Space {
  const baseId = 1000000;
  const report1: LabReport = {
    id: (baseId + 1).toString(),
    labNumber: '6',
    topic: 'Кількісна оцінка інформації',
    enabledBlocks: ['abstract', 'workProgress', 'conclusion', 'appendix'],
    abstract: {
      content: 'Ознайомитися з поняттям кількісної оцінки інформації, вивчити формулу Шеннона для визначення ентропії, навчитися обчислювати ентропію випадкових подій та будувати залежність ентропії від частоти появи певних чисел.',
    },
    workProgress: {
      items: [
        { id: (baseId + 10).toString(), text: 'Здійснити вибірку чисел сформувавши масив випадкових чисел від 1 до 10 розміром 100 елементів.' },
        { id: (baseId + 11).toString(), text: 'За формулою Шеннона обчислити ентропію появи певних чисел.' },
        { id: (baseId + 12).toString(), text: 'Побудувати залежність ентропії появи чисел як функцію їх значень.' },
        {
          id: (baseId + 13).toString(),
          text: 'Оцінити отриманий результат з точки зору теорії інформації. Отримані значення ентропії показують наскільки невизначеною є система.',
          itemCode: '# Оцінка ентропії\nprint(f"Ентропія = {H:.4f} біт")',
        },
      ],
    },
    conclusion: {
      content: 'У ході виконання лабораторної роботи було досліджено поняття ентропії як міри невизначеності інформаційної системи. Реалізовано програму на Python для генерації випадкових чисел, обчислення ентропії за формулою Шеннона та побудови графіка. Результати підтвердили, що ентропія зростає із рівномірністю розподілу.',
    },
    appendix: {
      title: 'Код програми',
      code: `import random
import matplotlib.pyplot as plt
import math

def shenonFormula(arr, SIZE):
    total = 0
    for N in range(1, 11):
        Pi = arr.count(N) / SIZE
        if Pi > 0:
            total += Pi * math.log2(Pi)
    return -total

myArray = [random.randint(1, 10) for _ in range(100)]
SIZE = len(myArray)

print(f"Ентропія = {shenonFormula(myArray, SIZE):.4f} біт")

HArray = [-myArray.count(N)/SIZE * math.log2(myArray.count(N)/SIZE)
          for N in range(1, 11) if myArray.count(N) > 0]

plt.plot(range(1, len(HArray)+1), HArray)
plt.xlabel("Значення числа")
plt.ylabel("H(x)")
plt.title("Ентропія")
plt.show()`,
    },
  };

  const report2: LabReport = {
    id: (baseId + 2).toString(),
    labNumber: '7',
    topic: 'Кодування даних',
    enabledBlocks: ['abstract', 'workProgress', 'conclusion'],
    abstract: {
      content: 'Ознайомитися з основними методами кодування даних: кодом Хафмана та кодом Хеммінга.',
    },
    workProgress: {
      items: [
        { id: (baseId + 20).toString(), text: 'Реалізувати алгоритм побудови дерева Хафмана для заданого набору символів.' },
        { id: (baseId + 21).toString(), text: 'Закодувати рядок та порівняти розмір з оригінальним.' },
        { id: (baseId + 22).toString(), text: 'Перевірити правильність декодування.' },
      ],
    },
    conclusion: {
      content: 'В результаті роботи було реалізовано алгоритм Хафмана, який дозволяє досягти стиснення даних залежно від частоти входження символів.',
    },
    appendix: { title: 'Код програми', code: '' },
  };

  return {
    id: baseId.toString(),
    courseName: 'Цифрова обробка інформації',
    teacherTitle: 'Асист.',
    teacherName: 'Іжик О.В.',
    reports: [report1, report2],
  };
}
