using System.Globalization;

namespace API.helpers
{
    public class Utils
    {
        /// <summary>
        /// Возвращает дату для поля date_from.
        /// Пример: возвращает дату, сдвинутую на 7 дней назад.
        /// </summary>
        public static string OffsetDate()
        {
            // Для примера отнимаем 7 дней от текущей даты.
            return DateTime.UtcNow.AddMonths(-3).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Возвращает текущую дату для поля date_to.
        /// </summary>
        public static string FormatDateNow()
        {
            return DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        }

        public static int ConvertMetricToInt(object metric)
        {
            return metric switch
            {
                int intValue => intValue,                         // Если это целое число
                double doubleValue => (int)doubleValue,           // Если это дробное число
                decimal decimalValue => (int)decimalValue,        // Если это decimal
                string stringValue when double.TryParse(stringValue, out var result) => (int)result, // Если это строка
                _ => 0                                           // Если ничего из вышеперечисленного не подошло
            };
        }
    }
}
