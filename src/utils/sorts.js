export const mapOrder = (originalArray, orderArray, key) => {
  // Kiểm tra xem originalArray, orderArray và key có tồn tại không
  if (!originalArray || !orderArray || !key) return []

  // Clone mảng gốc
  const clonedArray = [...originalArray]
  const orderedArray = clonedArray.sort((a, b) => {
    // lấy vị trí của a[key] và b[key] trong orderArray để so sánh
    const aIndex = orderArray.indexOf(a[key])
    const bIndex = orderArray.indexOf(b[key])
    // nếu trả về dương thì a đứng sau b, âm thì a đứng trước b, 0 thì không thay đổi vị trí
    return aIndex - bIndex
  })

  return orderedArray
}

// const originalItems = [
//   { id: 'id-1', name: 'One' },
//   { id: 'id-2', name: 'Two' },
//   { id: 'id-3', name: 'Three' },
//   { id: 'id-4', name: 'Four' },
//   { id: 'id-5', name: 'Five' }
// ]
// const itemOrderIds = ['id-5', 'id-4', 'id-2', 'id-3', 'id-1']
// const key = 'id'

// const orderedArray = mapOrder(originalItems, itemOrderIds, key)
/*
 [
	{ id: 'id-5', name: 'Five' },
  { id: 'id-4', name: 'Four' },
  { id: 'id-2', name: 'Two' },
  { id: 'id-3', name: 'Three' },
  { id: 'id-1', name: 'One' }
]
*/
