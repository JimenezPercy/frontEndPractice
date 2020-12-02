//节点类
class Node {
    constructor(element, prev, next) {
        this.element = element;
        this.next = next;
        this.prev = prev;
    }
}

//双向链表
class DoubleLinkedList {
    constructor() {
        this.size = 0;
        this.head = null;
        this.tail = null;
    }

    //获取指定索引的节点
    _node(index) {
        if (index < 0 || index > this.size) {
            throw new Error('越界');
        }
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        return current;
    }

    /**
     * add() 直接添加元素或在指定索引上添加元素
     * get(index) 胡哦去指定索引元素
     * set(index,element) 修改指定索引的节点内容
     * remove(index) 删除指定索引的节点
     * clear() 清空链表
     */
    add(index, element) {
        if (arguments.length === 1) {
            element = index;
            //在末尾添加
            index = this.size;
        }

        if (index < 0 || index > this.size) {
            throw new Error('越界');
        }

        //在末尾添加
        if (index === this.size) {
            //获取最初的末尾
            let oldLast = this.tail;
            this.tail = new Node(element, oldLast, null);
            //判断原链表是否为空
            if (oldLast === null) {
                //为空，头尾指向同一个节点
                this.head = this.tail;
            } else {
                oldLast.next = this.tail;
            }
        } else {
            let nextNode = this._node(index);
            let newNode = new Node(element, nextNode.prev, nextNode);
            if (nextNode.prev == null) {
                this.head = newNode;
            } else {
                nextNode.prev.next = newNode;
            }
            nextNode.prev = newNode;
        }

        //数量增加
        this.size++;
    }

    get(index) {
        return this._node(index);
    }

    set(index, element) {
        let node = this._node(index);
        node.element = element;
        return node;
    }

    remove(index) {
        if (index < 0 || index > this.size) {
            throw new Error('越界');
        }
        //当前节点
        let node = this._node(index);
        //上一个节点
        let prev = node.prev;
        //下一个节点
        let next = node.next;
        if (prev == null) {
            this.head = next;
        } else {
            prev.next = next;
        }

        if (next == null) {
            this.tail = prev;
        } else {
            next.prev = prev;
        }

        //数量减少
        this.size--;
    }

    clear() {
        this.size = 0;
        this.head = null;
        this.tail = null;
    }
}


let ll = new DoubleLinkedList();
ll.add(5);
ll.add(6);
ll.add(0, 7);
// ll.remove(1)
// ll.clear();
ll.remove(0);
// console.log(ll.get(1))
console.log(ll.tail)
console.log(ll.head)
