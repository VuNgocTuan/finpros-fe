export default class ArrayUtils {
    static transformSingleDataForSelectInput(data: Array<String>) {
        const dataTranformed: any[] = [];
        data.map((item) => {
            dataTranformed.push({
                label: item,
                value: item
            })
        });

        return dataTranformed;
    }
}