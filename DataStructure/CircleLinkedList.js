//节点类
class Node {
    constructor(element, next) {
        this.element = element;
        this.next = next;
    }
}

//单向循环列表
class CircleLinkedList {
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
            let newHead = new Node(element, head);
            let last = this.size == 0 ? newHead : this._node(this.size - 1);
            this.head = newHead;
            last.next = newHead;
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
        //移除第一个节点，改变head和末尾元素的next指向
        if (index === 0) {
            //只有一个节点，直接删除
            if (this.size === 1) {
                this.head = null;
            }else {
                let last = this._node(this.size - 1);
                this.head = this.head.next;
                last.next = this.head;
            }
        } else {
            //获取上一个节点
            let preNode = this._node(index - 1);
            preNode.next = preNode.next.next;
        }
        //数量减少
        this.size--;
    }

    clear() {
        this.size = 0;
        this.head = null;
    }
}


let ll = new CircleLinkedList();
ll.add(1);
ll.add(2);
ll.remove(0)
console.log(ll)
