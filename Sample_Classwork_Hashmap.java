///////////////////////////////////////////////////////////////////////////////
//                   ALL STUDENTS COMPLETE THESE SECTIONS
// Main Class File:  LoadBalancerMain.java
// File:             SimpleHashMap.java
// Semester:         CS302 Spring 2014
//
// Author:           Joseph Hoffmann
// CS Login:         josephh
// Lecturer's Name:  Jim Skrentny
//
///////////////////////////////////////////////////////////////////////////////
import java.util.*;

/**
* This class implements a generic map based on hash tables using chained
* buckets for collision resolution.
*
* <p>A map is a data structure that creates a key-value mapping. Keys are
* unique in the map. That is, there cannot be more than one value associated
* with a same key. However, two keys can map to a same value.</p>
*
* <p>The <tt>SimpleHashMap</tt> class takes two generic parameters, <tt>K</tt>
* and <tt>V</tt>, standing for the types of keys and values respectively. Items
* are stored in a hash table. Hash values are computed from the
* <tt>hashCode()</tt> method of the <tt>K</tt> type objects.</p>
*
* <p>The chained buckets are implemented using Java's <tt>LinkedList</tt>
* class.  When a hash table is created, its initial table size and maximum
* load factor is set to <tt>11</tt> and <tt>0.75</tt>. The hash table can hold
* arbitrarily many key-value pairs and resizes itself whenever it reaches its
* maximum load factor.</p>
*
* <p><tt>null</tt> values are not allowed in <tt>SimpleHashMap</tt> and a
* NullPointerException is thrown if used. You can assume that <tt>equals()</tt>
* and <tt>hashCode()</tt> on <tt>K</tt> are defined, and that, for two
* non-<tt>null</tt> keys <tt>k1</tt> and <tt>k2</tt>, if <tt>k1.equals(k2)</tt>
* then <tt>k1.hashCode() == k2.hashCode()</tt>. Do not assume that if the hash
* codes are the same that the keys are equal since collisions are possible.</p>
*/
public class SimpleHashMap<K, V> {

    /**
     * A map entry (key-value pair).
     */
    public static class Entry<K, V> {
        private K key;
        private V value;

        /**
         * Constructs the map entry with the specified key and value.
         */
        public Entry(K k, V v) {
            key = k;
            value = v;
        }

        /**
         * Returns the key corresponding to this entry.
         *
         * @return the key corresponding to this entry
         */
        public K getKey() {
            return key;
        }

        /**
         * Returns the value corresponding to this entry.
         *
         * @return the value corresponding to this entry
         */
        public V getValue() {
            return value;
        }

        /**
         * Replaces the value corresponding to this entry with the specified
         * value.
         *
         * @param value new value to be stored in this entry
         * @return old value corresponding to the entry
         */
        public V setValue(V value) {
            V oldValue = value;
            this.value = value;
            return oldValue;
        }
    }

    //Class fields
    private int[] primes = {11,23,47,97,197,397,797,1597,3203,6421,
            12853,25717,51437,102877,205759,411527,823117,1646237,
            3292489,6584983,13169977,26339969,52679969,105359939,
            210719881,421439783,842879579,1685759167};
    private int primeIndex = 0;
    private double size;
    private double loadFactor;
    private LinkedList<Entry<K,V>>[] hashTable;

    /**
     * Constructs an empty hash map with initial capacity <tt>11</tt> and
     * maximum load factor <tt>0.75</tt>.
     **/
    public SimpleHashMap() {
        //Initialize class fields
        hashTable = (LinkedList<Entry<K, V>>[])
                new LinkedList[primes[primeIndex]];
        for(int i = 0; i < hashTable.length; i++)
            hashTable[i] = new LinkedList<Entry<K, V>>();
        primeIndex++;
        size = 0;
        loadFactor = 0.75;
    }

    /**
     * Returns the value to which the specified key is mapped, or null if this
     * map contains no mapping for the key.
     *
     * @param key the key whose associated value is to be returned
     * @return the value to which the specified key is mapped, or <tt>null</tt>
     * if this map contains no mapping for the key
     * @throws NullPointerException if the specified key is <tt>null</tt>
     */
    public V get(Object key) {
        //Check for null parameter
        if(key == null)
            throw new NullPointerException();

        //Find and return the object searched for
        for(Entry<K, V> entry : hashTable[hashFunction(key)])
            if(entry.getKey().equals(key))
                return entry.getValue();

        return null;
    }

/**
 * <p>Associates the specified value with the specified key in this map.
 * Neither the key nor the value can be <tt>null</tt>. If the map
 * previously contained a mapping for the key, the old value is replaced.</p>
 *
 * <p>If the load factor of the hash table after the insertion would exceed
 * the maximum load factor <tt>0.75</tt>, then the resizing mechanism is
 * triggered. The size of the table should grow at least by a constant
 * factor in order to ensure the amortized constant complexity. You must also
 * ensure that the new selected size is Prime. After that, all of the mappings
 * are rehashed to the new table.</p>
 *
 * @param key key with which the specified value is to be associated
 * @param value value to be associated with the specified key
 * @return the previous value associated with <tt>key</tt>, or
 * <tt>null</tt> if there was no mapping for <tt>key</tt>.
 * @throws NullPointerException if the key or value is <tt>null</tt>
 */
    public V put(K key, V value) {
        //Check null parameters
        if(key == null || value == null)
            throw new NullPointerException();

        //Check if insertion kills load size
        if((size + 1)/(double) hashTable.length > 0.75)
            resize();

        //Insert
        Entry<K, V> entry = new Entry<K, V>(key, value);
        V oldValue = null;
        for(Entry<K, V> sub : hashTable[hashFunction(key)]) {
            oldValue = sub.getValue();
            if(sub.getKey().equals(key)) {
                hashTable[hashFunction(key)].remove(sub);
                hashTable[hashFunction(key)].add(entry);
                return oldValue;
            }
        }
        hashTable[hashFunction(key)].add(entry);

        size++;

        return oldValue;
    }

/**
 * Removes the mapping for the specified key from this map if present. This
 * method does nothing if the key is not in the hash table.
 *
 * @param key key whose mapping is to be removed from the map
 * @return the previous value associated with <tt>key</tt>, or <tt>null</tt>
 * if there was no mapping for <tt>key</tt>.
 * @throws NullPointerException if key is <tt>null</tt>
 */
    public V remove(Object key) {
        //Check for null parameters
        if(key == null)
            throw new NullPointerException();

        //Check for existence and remove if found
        V oldValue = null;
        for(int i = 0; i < hashTable[hashFunction(key)].size(); i++) {
            Entry<K, V> sub = hashTable[hashFunction(key)].get(i);
            oldValue = sub.getValue();
            if(sub.getKey().equals(key)) {
                hashTable[hashFunction(key)].remove(i);
                size--;
                return oldValue;
            }
        }

        return oldValue;
    }

    /**
     * Returns the number of key-value mappings in this map.
     *
     * @return the number of key-value mappings in this map
     */
    public int size() {
        return (int) size;
    }

    /**
     * Returns a list of all the mappings contained in this map. This method
     * will iterate over the hash table and collect all the entries into a new
     * list. If the map is empty, return an empty list (not <tt>null</tt>).
     * The order of entries in the list can be arbitrary.
     *
     * @return a list of mappings in this map
     */
    public List<Entry<K, V>> entries() {
        //Create a new list to be returned
        LinkedList<Entry<K, V>> entries = new LinkedList<Entry<K, V>>();

        //Iterate through the the hashTable and retrieve its items
        for(LinkedList<Entry<K, V>> list : hashTable) {
            if (list.size() != 0) {
                for (Entry<K, V> entry : list)
                    entries.add(entry);
            }
        }
        return entries;
    }

    /**
     * Creates an index for a given key value.
     *
     * @param key key whose mapping is determined
     * @return the index for the hashTable
     */
    private int hashFunction(Object key) {
        //Create an index according the to table size and objects hashFunc
        int index = key.hashCode() % hashTable.length;

        if(index < 0)
            index = index + hashTable.length;

        return index;
    }

    /**
     * Resizes the hashTable to the closest prime number that is
     * at least double the size of the old table. Deletes the old
     * table and refills the new table with old values.
     */
    private void resize() {
        //Create a new hashTable
        LinkedList<Entry<K,V>>[] newHashTable = (LinkedList<Entry<K, V>>[])
                new LinkedList[primes[primeIndex]];
        for(int i = 0; i < newHashTable.length; i++)
            newHashTable[i] = new LinkedList<Entry<K, V>>();
        primeIndex++;

        //Replace the old table with the new one
        List<Entry<K, V>> entries = entries();
        hashTable = newHashTable;
        size = 0;

        //Fill the new hashTable with the old objects
        for(Entry<K, V> entry : entries)
            put(entry.getKey(), entry.getValue());

    }
}
