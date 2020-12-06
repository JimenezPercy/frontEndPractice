//节点类
class Node {
    constructor(element, next) {
        this.element = element;
        this.next = next;
    }
}

//链表类
class LinkedList {
    constructor() {
        this.size = 0;
        this.head = null;
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

        //第一个节点
        if (index === 0) {
            let head = this.head;
            this.head = new Node(element, head);
        } else {
            //获取当前索引上一个节点
            let preNode = this._node(index - 1);
            preNode.next = new Node(element, preNode.next);
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
        //保存删除节点
        let node;
        //移除第一个节点，改变head指向
        if (index === 0) {
            node = this.head;
            if (!node) {
                return undefined;
            }
            this.head = this.head.next;
        } else {
            //获取上一个节点
            let preNode = this._node(index - 1);
            node = preNode.next;
            preNode.next = preNode.next.next;
        }
        //数量减少
        this.size--;
        //返回删除节点
        return node;
    }

    clear() {
        this.size = 0;
        this.head = null;
    }

    //递归反转链表
    recursionReverseList() {
        function reverse(head) {
            if (head == null || head.next == null) return head;
            let newHead = reverse(head.next);
            head.next.next = head;
            head.next = null;
            return newHead;
        }

        this.head = reverse(this.head);
        return this.head;
    }

    //遍历反转链表
    ergodicReverseList() {
        //原链表游标
        let head = this.head;
        if (head == null || head.next == null) return head;
        //新链表头
        let newHead = null;
        while (head != null) {
            let temp = head.next;
            //添加到新链表头部
            head.next = newHead;
            newHead = head;
            //head指向下一个节点
            head = temp;
        }
        this.head = newHead;
        return newHead;
    }
}


// let ll = new LinkedList();
// ll.add(4);
// ll.add(5);
// ll.add(6);
// ll.add(1, 7);
// ll.set(1, 123)
// // ll.remove(1)
// // ll.clear();
// // console.log(ll.get(1))
// console.log(ll.ergodicReverseList())


module.exports = LinkedList;
