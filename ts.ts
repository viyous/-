function displayType<T>(arg:T):T

//判断两个类型是否完全相同
type equal<M,N> = M extends N ? N extends M ? true : false : false

//获取字符串开头的部分或者是其余部分
type getStringTop<T extends string,is extends boolean = true> = T extends `${infer top}${infer last}` ? is extends true ? top : last : never

//获取数组开头的部分或者是其余部分
type getArrayTop<T extends Array,is extends boolean = true> = T extends [infer top,...infer last] ? is extends true ? top : last : never


//把字符串分割成数组
type stringToArray<T extends string,result extends string[] = []> = equal<T,''> extends true ? result : stringToArray<getStringTop<T,false>,[...result,getStringTop<T>]>

//把数组合并成字符串
type arrayToString<T extends Array,result extends string = ''> = T['length'] extends 0 ? result : arrayToString<getArrayTop<T,false>,`${result}${T[0]}`>


//反转数组
type invertArray<T extends Array,result extends Array = []> = T['length'] extends 0 ? result : invertArray<getArrayTop<T,false>,[getArrayTop<T>,...result]>


//判断元素是否在数组里
type includes<T extends Array,element extends T[number]> = T['length'] extends 0 ? false : equal<element,T[0]> extends true ? true : includes<getArrayTop<T,false>,element>

//获取该元素在该数组的下一个元素
type next<List extends Array,element extends List[number]> = List['length'] extends 1 ? never : equal<element,List[0]> extends true ? getArrayTop<List,false>[0] :  next<getArrayTop<List,false>,element>

//定义数字
type TheNumber = ['0','1','2','3','4','5','6','7','8','9']

//可能的进位的数字
type TheNumberTen = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19']

//需要进位的数字
type CarryNumber = ['10','11','12','13','14','15','16','17','18','19']

//可能的数字组合
type NumberMatching = [
'00','01','02','03','04','05','06','07','08','09',
'11','12','13','14','15','16','17','18','19',
'22','23','24','25','26','27','28','29',
'33','34','35','36','37','38','39',
'44','45','46','47','48','49',
'55','56','57','58','59',
'66','67','68','69',
'77','78','79',
'88','89',
'99'
]

//对应以上数字组合的加法结果
type AddResult = [
'0','1','2','3','4','5','6','7','8','9',
'2','3','4','5','6','7','8','9','10',
'4','5','6','7','8','9','10','11',
'6','7','8','9','10','11','12',
'8','9','10','11','12','13',
'10','11','12','13','14',
'12','13','14','15',
'14','15','16',
'16','17',
'18'
]

/**
 * 实现个位数相加
 * 找到 ab|ba 所在数字组合的位置
 * 返回 加法表 中的同等位置
 * 原理，递归判断是否为第一个元素，如果是就返回，不是就移除开头元素
 */
type aAdd<
a extends TheNumber[number] = '0',
b extends TheNumber[number] = '0',
List = NumberMatching,
Result = AddResult,
map1 = `${a}${b}`,
map2 = `${b}${a}`,
> = equal<map1,List[0]> extends true ? Result[0] : equal<map2,List[0]> extends true ? Result[0] : aAdd<a,b,getArrayTop<List,false>,getArrayTop<Result,false>>

/**
 * 数组对应位置想加，没有则默认为0
 * 为什么判断长度等于0:因为这代表着后面没有元素，可以直接截断另一个数组
 * 为什么判断了两次 b 的长度:一次是在a长度为0时，另一次则不是
 */
type arrayAdd<
a extends TheNumber[number][] = ['0'],
b extends TheNumber[number][] = ['0'],
result extends AddResult[number][] = []
> = a['length'] extends 0 ? b['length'] extends 0 ? result : [...result,...b] : b['length'] extends 0 ? [...result,...a] : arrayAdd<getArrayTop<a,false>,getArrayTop<b,false>,[...result,aAdd<getArrayTop<a>,getArrayTop<b>>]>

/**
 * 进位
 * 原理，如果需要进位，则结果中直接添加尾数，同时下一位+1(利用next)，如何不需要进位，则直接加入结果
 * 由于不能拓展数组，所以留了一位不处理进位，即允许多位，不影响结果
 */
type carryAdd<T extends AddResult[number][],result extends AddResult[number][] = []> =
T['length'] extends 1 ? [...result,T[0]] :
includes<CarryNumber,T[0]> extends true ? carryAdd<[next<TheNumberTen,getArrayTop<T,false>[0]>,...getArrayTop<getArrayTop<T,false>,false>],[...result,getStringTop<T[0],false>]> : carryAdd<getArrayTop<T,false>,[...result,T[0]]>

/**
 * 加法
 * 写成字符串数组形式
 * 末尾对齐(倒置数组)
 * 相加
 * 进位
 * 再倒置
 * 转字符串
 */
type Add<a extends string,b extends string> = arrayToString<invertArray<carryAdd<arrayAdd<invertArray<stringToArray<a>>,invertArray<stringToArray<b>>>>>>



/**
 * 乘法结果表
 */
type MultiplyResult = [
'0','0','0','0','0','0','0','0','0','0',
'1','2','3','4','5','6','7','8','9',
'4','6','8','10','12','14','16','18',
'9','12','15','18','21','24','27',
'16','20','24','28','32','36',
'25','30','35','40','45',
'36','42','48','54',
'49','56','63',
'64','72',
'81'
]
/**
 * 个位数相乘
 */
type aMultiply<a extends TheNumber[number] = '0',b extends TheNumber[number] = '0'> = aAdd<a,b,NumberMatching,MultiplyResult>


/**
 * 填充数组
 */
type fillArray<array extends Array = [],element extends array,max_length extends string> = equal<`${array['length']}`,max_length> extends true ? array : fillArray<[...array,element],element,max_length>

/**
 * for(let ii in B)
 */
type ForB<
res extends string[],
AValue extends string,
B extends string[],
result extends string[] = [],
> = B['length'] extends 0 ? [...result,...res] : ForB<getArrayTop<res,false>,AValue,getArrayTop<B,false>,[...result,Add<res[0],aMultiply<AValue,B[0]>>]>


/**
 * 切割数组
 */
type segmentation<array extends Array,length extends string,is extends boolean = true,times extends string = '0',result extends Array = []> = equal<times,length> extends true ? is extends true ? result : array : segmentation<getArrayTop<array,false>,length,is,Add<times,'1'>,[...result,getArrayTop<array>]>


/**
 * for(let i in A)
 * for(let ii in B)
 * 难点是fillArray里的'0'不要写成0了
 */
type ForA<A extends string[],B extends string[],result extends string[] = fillArray<[],'0',Add<`${getArrayTop<A,false>['length']}`,`${B['length']}`>>,index extends string = '0'> = A['length'] extends 0 ? result : ForA<getArrayTop<A,false>,B,[...segmentation<result,index>,...ForB<segmentation<result,index,false>,A[0],B>],Add<index,'1'>>

/**
 * 获取字符串末尾
 * 可反选
 */
type getStringEnd<S extends string,is extends boolean = true> = stringToArray<S> extends [...infer data,infer end] ? is extends true ? end : arrayToString<data> : never

/**
 * 进位，非一位数就要进位
 * 进的数字恰好是去掉末尾的
 */
type carryMultiply<A extends string[],result extends string[] = []> = A['length'] extends 1 ? [...result,A[0]]: equal<getStringTop<A[0],false>,''> extends true ? carryMultiply<getArrayTop<A,false>,[...result,A[0]]> : carryMultiply<[Add<getArrayTop<A,false>[0],getStringEnd<A[0],false>>,...getArrayTop<getArrayTop<A,false>,false>],[...result,getStringEnd<A[0]>]>


/**
 * 移除前导0
 * 会保留一个0
 */
type removeZero<A extends string[]> = A['length'] extends 1 ? A : equal<A[0],'0'> extends true ? removeZero<getArrayTop<A,false>> : A

/**
 * 没什么好说的
 */
type Multiply<a extends string,b extends string> = arrayToString<removeZero<invertArray<carryMultiply<invertArray<ForA<stringToArray<a>,stringToArray<b>>>>>>>

type If<A,B,false_value = false> = A extends true ? B : false_value

type IfElse<A,V1,V2> = A extends true ? V1 : V2

type And<A,B> = A extends true ? B extends true ? true : false : false

type Or<A,B> = A extends true ? true : B extends true ? true : false

type Not<A> = A extends true ? false : true

/**
 * 一位数，取出较大的那个
 */
type a_max<A extends TheNumber[number],B extends TheNumber[number],numbers extends TheNumberp = TheNumber> = equal<A,getArrayTop<numbers>> extends true ? B : equal<B,getArrayTop<numbers>> extends true ? A : a_max<A,B,getArrayTop<numbers,false>>
/**
 * 一位数，判断第一个数是否大于等于第一个数
 */
type a_is_max<A extends TheNumber[number],B extends TheNumber[number],strict extends boolean = true> = IfElse<strict,If<And<equal<a_max<A,B>,A>,Not<equal<A,B>>>,true,false>,equal<a_max<A,B>,A>>

/**
 * 多位数的逻辑
 * 由于无法比较元组长度，所以只能递归到某元组为空
 */
type max<A extends TheNumber[number][],B extends TheNumber[number][],A_isBig extends boolean = true,lock extends boolean = false,AA = A,BB = B> = IfElse<And<equal<A['length'],0>,equal<B['length'],0>>,IfElse<A_isBig,AA,BB>,IfElse<And<equal<A['length'],0>,Not<equal<B['length'],0>>>,BB,And<equal<B['length'],0>,Not<equal<A['length'],0>>> extends true ? AA : max<getArrayTop<A,false>,getArrayTop<B,false>,IfElse<lock,A_isBig,a_is_max<A[0],B[0]>>,IfElse<lock,true,Not<equal<A[0],B[0]>>>,AA,BB>>>

type Max<A extends string,B extends string> = arrayToString<max<stringToArray<A>,stringToArray<B>>>

type isMax<A extends string,B extends number,strict extends boolean = true> = IfElse<strict,If<And<equal<A,Max<A,B>>,Not<equal<A,B>>>,true>,equal<A,Max<A,B>>>

type slice<array extends Array = [],start = '0',end extends string = `${array['length']}`,result = []> = equal<start,end> extends true ? result : slice<array,Add<start,'1'>,end,[...result,array[start]]>

type Next<n extends string|number> = Add<`${n}`,'1'>

type match<array extends Array,element extends array[number],start = '0',isIndex extends boolean = true,result = []> = equal<array[start],element> extends true ? IfElse<isIndex,start,result> : match<array,element,Next<start>,isIndex,[...result,array[start]]>

type pairing<
array extends Array,
start = '0',
endstring = ')',
result = [],
success = '1',
target = '0',
startstring = array[start]> = 

equal<success,target> extends true ? 
[start,result] : 

equal<array[Next<start>],startstring> extends true ? 

pairing<array,Next<start>,endstring,[...result,array[Next<start>]],Next<success>,target,startstring> : 

equal<array[Next<start>],endstring> extends true ? 

pairing<array,Next<start>,endstring,equal<Next<target>,success> extends true ? result :

[...result,array[Next<start>]],success,Next<target>,startstring> : 

pairing<array,Next<start>,endstring,[...result,array[Next<start>]],success,target,startstring>

type analysisStringToArray<
T extends string[],
array = [],
start = '0',
result = pairing<T,start>
> = equal<Next<result[0]>,`${T['length']}`> extends true ? 
[...array,arrayToString<result[1]>] : 
analysisStringTo<T,[...array,arrayToString<result[1]>],Next<result[0]>>

type findIndex<A,element,index = '0'> = equal<index,`${A['length']}`> extends true ? -1 : equal<A[index],element> extends true ? index : findIndex<A,element,Next<index>>

type analysisArrayToObject<A,B> = {[key in A[number]]:B[findIndex<A,key>]}

type RangeIn<value,min_value,max_value> = And<isMax<value,min_value,false>,isMax<max_value,value,false>>



type Splice<
A extends Array,
start extends string = '0',
end extends string = `${A['length']}`,
add extends Array = [],
result = [],
deleteArray = [],
index = '0'
> = A[index] extends undefined ? [result,deleteArray] : equal<start,index> extends true ? Splice<A,start,end,add,[...result,...add],[A[start]],Next<index>> : 
RangeIn<index,start,end> extends true ?
Splice<A,start,end,add,result,[...deleteArray,A[index]],Next<index>> : Splice<A,start,end,add,[...result,A[index]],deleteArray,Next<index>>

displayType<Splice<[0,1,2,3,4,5,6],'2','4',[7,8,9]>>()

interface keyword {
'+':{
length:2
}
'output=>':{
length:1
}
'let':{
length:1
}
'top':{
length:1
}
'up':{
length:1
}
'down':{
length:1
}
'<=':{
length:1
}
}

type variable = [{}]

type typeNames = [
'keyword',
'functionStatement',
'functionInvoke',
'number',
'object',
'string',
'variable'
]

type recognize<
str extends string,
Keyworld = keyword
> = equal<Keyworld[str],any> extends true ? str extends `<(${infer data})>` ? 'array' : true : 'keyword'

displayType<recognize<'<()()()()>'>>()